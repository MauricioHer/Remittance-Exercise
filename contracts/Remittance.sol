pragma solidity^0.4.19;  //Esta es la versión de solidity usada en truffle.

contract Remittance{
    mapping(bytes32 => bool) public password;   //guarda las contraseñas creadas
    address public owner;					//guarda dirección de Alice
    address public receiver;				//guarda dirección de Carol
    bytes32 public puzzle;			//guarda el acertijo keccak256
    uint public timer;			//guarda el tiempo en que el contrato esta vigente
    uint public timeOfCreation;	//solo se usa en los test.
    
    modifier onlyAlice(){			
        require(owner==msg.sender);		//Solo el que envía puede interactuar.
        _;
    }
    modifier onlyOtherOne(){
        require(receiver==msg.sender);  //Solo carol puede interactuar
        _;
    }
    
    modifier deadTime(){
      require(timer > block.number); //luego de este tiempo, el contrato no entrega fondos al receptor.
      _;
    }
    // se uso block.number ya que block.timeStamp es vulnerable a maliciosos.
    //UN_AÑO_DE_BLOQUES = 365 * 86400 / 15; // 2,102,400
    
    function Remittance() public payable{
        owner=msg.sender; //fija a Alice como la dueña al crear el contrato.
    } 
    
    
    function setConfiguration(bytes32 _hash, address receiver_add, uint deadline) onlyAlice public{
            require(_hash != bytes32(0));  //el hash no debe ser vacio.
            require(password[_hash]==false); //el hash no debe existir previamente en el contrato.
            password[_hash]=true; //indica el hash como usado.
            puzzle=_hash; //guarda el hash
            receiver=receiver_add; //guarda la dirección de Carol.
            timer=deadline+block.number;  //limita el tiempo en que el contrato peude ser usado.
	        timeOfCreation=block.number; //solo para la prueba en javascript
    }
    
    function withDraw(bytes32 Bob_Password, bytes32 Carol_Password) onlyOtherOne deadTime payable public{
        require(address(this).balance>0); //solo puede retirar si existe balance en el contrato.
        require(puzzle==keccak256(Bob_Password,Carol_Password));//si utiliza versión mayor a 0.2.23 usar abi.encodePacked
        //nota: con esto me aseguro que solo puede retirar el que tenga el acertijo
        receiver.transfer(address(this).balance); //si cumple con lo anterior puede retirar los fondos del contrato.

    }
    function removeFunds() public onlyAlice payable{ // solo ALICE puede
        require(address(this).balance>0); //requiere que tenga balance mayor a 0
        require(timer < block.timestamp); //solo puede retirar si ya se venció el tiempo límite
        owner.transfer(address(this).balance); //retira el balance.
    }
    function emergency()public onlyAlice{  //en caso de emergencia, devuelve los fondos y destruye el contrato.
        selfdestruct(owner);
    }

    function contractBalance() public view returns(uint){
    	return(address(this).balance);
    }
}
