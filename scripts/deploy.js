const main = async () => {

    console.log("Deplying Polygon Domain Name Service contract");

    const nameSpace = "samurai"
    const domain = "blue";
    const fee = '0.01'; // Fee in MATIC

    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy(nameSpace);
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);

    // Register a domain and pay the fee
    let txn = await domainContract.register(domain,  {value: hre.ethers.utils.parseEther(fee)});
    await txn.wait();
    console.log("Minted domain %s.%s", domain, nameSpace);
  
    // Verify the domain owner
    const domainOwner = await domainContract.getAddress(domain);
    console.log("MAIN: Owner of domain %s.%s is:", domain, nameSpace, domainOwner);

    // Set the mapping for this domain
    const txn2 = await domainContract.setRecord(domain, "ABC");
    await txn2.wait();

    const domainRecord = await domainContract.getRecord(domain);
    console.log("MAIN: Record for domain %s.%s is: %s", domain, nameSpace, domainRecord);

    // Check the account balance for the contract
    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance is now:", hre.ethers.utils.formatEther(balance));
  }
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();