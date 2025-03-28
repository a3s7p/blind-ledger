"use server";

// @ts-ignore
import { SecretVaultWrapper } from "secretvaults";
import schema from "@/schema.json" with { type: "json" };
import { Transaction } from "@/lib/utils";

// public demo config
const orgConfig = {
  orgCredentials: {
    secretKey:
      "0ac97ffdd83769c6c5032cb202d0957800e0ef151f015b0aaec52e2d864d4fc6",
    orgDid: "did:nil:testnet:nillion1v596szek38l22jm9et4r4j7txu3v7eff3uffue",
  },
  nodes: [
    {
      url: "https://nildb-nx8v.nillion.network",
      did: "did:nil:testnet:nillion1qfrl8nje3nvwh6cryj63mz2y6gsdptvn07nx8v",
    },
    {
      url: "https://nildb-p3mx.nillion.network",
      did: "did:nil:testnet:nillion1uak7fgsp69kzfhdd6lfqv69fnzh3lprg2mp3mx",
    },
    {
      url: "https://nildb-rugk.nillion.network",
      did: "did:nil:testnet:nillion1kfremrp2mryxrynx66etjl8s7wazxc3rssrugk",
    },
  ],
  // if empty, creates new
  schemaId: "",
  // if empty, creates new
  queryId: "",
};

const ORG: SecretVaultWrapper = await (async () => {
  const org = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    null,
    "sum",
  );
  await org.init();

  if (orgConfig.schemaId) {
    org.setSchemaId(orgConfig.schemaId);
  } else {
    const newSchema = await org.createSchema(schema, schema.title);
    console.log("Schema created:", newSchema);
    const newSchemaId = newSchema[0].schemaId;
    orgConfig.schemaId = newSchemaId;
    org.setSchemaId(newSchemaId);
  }

  return org;
})();

export async function readTxs() {
  try {
    const txs: Transaction[] = await ORG.readFromNodes();
    console.log("Read txs:", txs);

    return txs.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
    }));
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function readSums() {
  try {
    const results = [];
    const newQueryId = crypto.randomUUID();

    console.log("Attempting sum query...");

    for (const node of orgConfig.nodes) {
      const jwt = await ORG.generateNodeToken(node.did);

      try {
        const result = await ORG.makeRequest(node.url, "queries", jwt, {
          _id: newQueryId,
          name: "sum query",
          schema: orgConfig.schemaId,
          variables: {
            draft: {
              type: "boolean",
              description: "draft",
            },
          },
          pipeline: [
            {
              $match: {
                draft: "##draft",
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$amount.%share",
                },
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                sum_total: {
                  "%share": {
                    $mod: [
                      "$total",
                      {
                        $add: [
                          {
                            $pow: [2, 32],
                          },
                          15,
                        ],
                      },
                    ],
                  },
                },
                count: "$count",
              },
            },
          ],
        });
        results.push({ ...result, node });
        orgConfig.queryId = newQueryId;
      } catch (error: any) {
        console.error(`❌ Failed from ${node.url}:`, error.message);
        results.push({ error, node });
      }
    }

    for (const node of orgConfig.nodes) {
      const jwt = await ORG.generateNodeToken(node.did);

      try {
        const result = await ORG.makeRequest(node.url, "queries/execute", jwt, {
          id: newQueryId,
          variables: { draft: false },
        });
        results.push({ ...result, node });
      } catch (error: any) {
        console.error(`❌ Failed from ${node.url}:`, error.message);
        results.push({ error, node });
      }
    }

    console.log("Executed sum query:", results);
    return results;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function appendTx(tx: Transaction) {
  await appendTxs([tx]);
}

export async function appendTxs(txs: Transaction[]) {
  try {
    const withAllots = txs.map((tx) => ({
      ...tx,
      // encode datetime to string
      date: tx.date.toISOString(),
      amount: { "%allot": tx.amount },
    }));

    await ORG.writeToNodes(withAllots);
  } catch (error: any) {
    console.error(`❌ Failed`, error.message);
  }
}
