const Remittance = artifacts.require("./Remittance.sol");

contract('Remittance',accounts =>{console.log(accounts);
	let rem;
	var alice = accounts[0];
	var bob = accounts[1];
	var carol = accounts[2];
	

	beforeEach('set up contract',async function(){
	rem = await Remittance.new({from:accounts[0], value:100000000000000000})
	});

	it("it should be owned by creator",async function(){

	assert.equal(await rem.owner(), alice)	
	});
	
	it("contract balance should be the amount sent from owner", async function(){
	let balance = await rem.contractBalance();
	assert.equal(balance.valueOf(),100000000000000000,"there wasn't 100000 in the contract")});

	it("it should set the proper configuration",async function(){
	let participant = await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol,100000);
	assert.equal(await rem.puzzle(),"0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0","wrong");
	assert.equal(await rem.Carol(), carol, "wrong");
	assert.equal(await rem.password("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0"),true);
	assert.equal(await rem.password("whatever"),false);
	});

	it("the timer should be set 100000 seconds since the creation", async function(){
	let participant = await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol,100000);
	assert.isAbove( await rem.timer(),await rem.timeOfCreation())
	});

	it("if you have the password & you are Carol can Withdraw", async function(){
	const contractBalanceBefore = rem.contractBalance();
	const CarolBalanceBefore=web3.eth.getBalance(accounts[2]).toNumber();
	let participant = await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol,1000000);
	let withDraw = await rem.withDraw("kibernum","mauricio",{from:carol});
	assert.isAbove(contractBalanceBefore, await rem.contractBalance());
	assert.equal(await rem.contractBalance(),0);
	assert.isAbove(web3.eth.getBalance(carol).toNumber(),CarolBalanceBefore);
	
	});
	
	it("removeFunds can be use only by Alice & after the deadtime", async function(){
	const AliceBalanceBefore = web3.eth.getBalance(accounts[0]).toNumber();	
	let participant = await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol,-1)
	let remove = await rem.removeFunds();
	assert.isAbove(web3.eth.getBalance(alice).toNumber(),AliceBalanceBefore);
		
	});
	
	it("Emergency returns all the funds to Alice & only alice can use it", async function(){
	const AliceBalanceBefore = web3.eth.getBalance(accounts[0]).toNumber();	
	let participant = await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol,100000)
	let remove = await rem.emergency();
	assert.isAbove(web3.eth.getBalance(alice).toNumber(),AliceBalanceBefore);
	});
	
	it("No one else but carol can withdraw", async function(){
	await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol, 100000);
	try{
	await rem.withDraw("kibernum","mauricio",{from:accounts[1]})	
	}catch(error){
	return true;}
	throw new Error("I should never see this")
	});

	it("if you do not have the right password you cannot withDraw even if you are carol", async function(){
	await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol, 100000);
	try{
	await rem.withDraw("blabla","will_not_pass",{from:carol})}catch(error){
	return true;}
	throw new Error("I should not see this")
	});
	
	it("Alice cannot access a blank password as the puzzle",async function(){
	try{
	await rem.setConfiguration("",carol, 100000);
	}catch(error){
	return true;}
	throw new Error("If i see this i am wrong")
	});

	it("Alice cannot removeFunds before deadtime is over", async function(){
	await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol, 100000);
	try{
	await rem.removeFunds();
	}catch(error){
	return true;}
	throw new Error("it means that your code is wrong")	
	});

	it("you cannot use a password that already exist",async function(){
	await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol, 100000);
	try{
	await rem.setConfiguration("0x16e6e450cc173c2a82c7d52a81a868592bf7fd2441997c04759edb9f9a3f7dd0",carol, 100000)
	}catch(error){
	return true;}
	throw new Error("it means that your code is wrong")
	});

})
