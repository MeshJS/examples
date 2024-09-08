import * as readline from "node:readline/promises";

export async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const res = await rl.question(question);
  rl.close();
  return res;
}
