# Remittance-Exercise.b9lab
Project developed to understand the tools of ethereum and Truffle. <br/>
Alice quiere enviar ethers a Bob pero ella solo tiene ethers y Bob quiere que se le pague en moneda local.<br/>
Alice necesita enviar ethers a Carol quien cambiará los ethers a moneda local :<br/>
Para asegurar que solo Carol puede retirar el dinero y entregarselo a Bob, ambos tendran una clave única y privada que resuelve un acertijo, solo si mezclan ambas claves el acertijo es resuelto.<br/>
El contrato tiene las siguientes funcionalidades:</br>
  1. podamos consultar el saldo del contrato Remittance en la página web.
  2. Solo una vez que Carol y Bob pongan la clave correcta, permetirá a retirar los fondos.
  3. El contrato tiene un temporizador, de modo que si no retiran los ethers antes de tiempo, el contrato se bloquea.
  4. Una vez el contrato se bloquea, Alice puede retirar los fondos del contrato.
  5. El contrato tiene un interruptor de emergencia que destruye el contrato y devuelve los fondos a Alice.
  6. cubrir potencialmente datos de entrada malos.
