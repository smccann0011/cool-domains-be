const main = async () => {

    const nameSpace = "samurai"
    const domain = "red";
    const fee = '0.01'; // Fee in MATIC

    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy(nameSpace);
    await domainContract.deployed();
    console.log("MAIN: Contract deployed to:", domainContract.address);
    //console.log("MAIN: Contract deployed by:", owner.address);

    // Test registering an invalid domain
    //let txn1 = await domainContract.register('ThisIsAVeryLongDomainName', {value: hre.ethers.utils.parseEther(fee)});
    //await txn1.wait();

    // Register a domain and pay the fee
    let txn = await domainContract.register(domain, {value: hre.ethers.utils.parseEther(fee)});
    await txn.wait();
    console.log("Minted domain %s.%s", domain, nameSpace);

    // Verify the domain owner
    const domainOwner = await domainContract.getAddress(domain);
    console.log("MAIN: Owner of domain %s.%s is:", domain, nameSpace, domainOwner);

    // Check the account balance for the contract
    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance is now:", hre.ethers.utils.formatEther(balance));

    // Set the mapping for this domain
    const txn2 = await domainContract.setRecord(domain, "ABC");
    await txn2.wait();

    const domainRecord = await domainContract.getRecord(domain);
    console.log("MAIN: Record for domain %s.%s is: %s", domain, nameSpace, domainRecord);

    // Try to set a record that doesn't belong to me
    //const [owner, randomPerson] = await hre.ethers.getSigners();
  
    //console.log("MAIN: Try to set the record using a different owner");
    //txn = await domainContract.connect(randomPerson).setRecord("doom", "ZZZ");
    //await txn.wait()

    // Register another domain and pay the fee
    let txn1 = await domainContract.register("blue", {value: hre.ethers.utils.parseEther(fee)});
    await txn1.wait();
    console.log("Minted domain %s.%s", "blue", nameSpace);
  
    // Show the set of domains created
    const allNames = await domainContract.getAllNames();
    console.log("List of names:", allNames);
  };
  
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