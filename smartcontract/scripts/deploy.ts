import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("Deploying IntentRemit contracts with account:", deployerAddress);

  // Deploy PaymentFactory
  console.log("\nDeploying PaymentFactory...");
  const PaymentFactory = await ethers.getContractFactory("PaymentFactory");
  const paymentFactory = await PaymentFactory.deploy();
  await paymentFactory.waitForDeployment();
  const factoryAddress = await paymentFactory.getAddress();
  const factoryTx = paymentFactory.deploymentTransaction()?.hash ?? "";
  console.log("PaymentFactory deployed to:", factoryAddress);

  // Deploy ConditionOracle
  console.log("\nDeploying ConditionOracle...");
  const ConditionOracle = await ethers.getContractFactory("ConditionOracle");
  const oracle = await ConditionOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  const oracleTx = oracle.deploymentTransaction()?.hash ?? "";
  console.log("ConditionOracle deployed to:", oracleAddress);

  // Save deployment record
  const deploymentData = {
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployerAddress,
    timestamp: new Date().toISOString(),
    contracts: {
      PaymentFactory: {
        address: factoryAddress,
        transactionHash: factoryTx,
      },
      ConditionOracle: {
        address: oracleAddress,
        transactionHash: oracleTx,
      },
    },
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(deploymentsDir, "deployment.json"),
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("\n✅ Deployment record saved to deployments/deployment.json");

  console.log("\n=== Deployment Complete — Celo Mainnet ===");
  console.log("PaymentFactory:", factoryAddress);
  console.log("ConditionOracle:", oracleAddress);
  console.log("\nNext steps:");
  console.log("1. Verify PaymentFactory on CeloScan:");
  console.log("   npx hardhat verify --network celo", factoryAddress);
  console.log("2. Verify ConditionOracle on CeloScan:");
  console.log("   npx hardhat verify --network celo", oracleAddress);
  console.log("3. Update PAYMENT_FACTORY_ADDRESS in frontend/lib/contracts.ts");
  console.log("4. Deploy ConditionalPayment via PaymentFactory.createPayment()");
  console.log("\nView on CeloScan:");
  console.log("  https://celoscan.io/address/" + factoryAddress);
  console.log("  https://celoscan.io/address/" + oracleAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
