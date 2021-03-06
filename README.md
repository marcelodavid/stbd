# stbd
Trabajo de Grado para la obtención del título de Ingeniero en Electrónica con énfasis en teleprocesamiento de la información.
----
El proyecto se enfoca en la etapa de distribucion de una red electrica, aplicado a usuarios de la Administración Nacional de Distribución de Energía **ANDE**.

## Prototipo

Dispositivo IOT que sincroniza los registros de los medidores capaces de soportar los protocolos IEC 62056. Construido con arreglos de transistores y transductores de luz. Los datos son enviados periodicamente, empleando websockets, al centro de monitoreo.

### Partes del Proyecto
* Sensor: MCU de 32 bits - ARM Cortex M0 PSoC 4
* Modulo Inalambrico: Xbee, maneja el protocolo zig bee para redes en mesh
* Concentrador: Raspberry Pi B+ con conexión a internet. La Función del concentrador es reenviar los datos recolectados al centro de supervisión, soporta un total de 256 nodos conectados.
* Aplicativo: Desarrollado en nodeJS y Angular. Actualemnete descontinuado. El aplicativo se desarrolló para mostrar las funcionalidades posibles que pueden aplicarse al explotar los datos recolectados. Analisis predictivo de la red, facturación, alertas y supervisión de los elementos que conforman el sistema

<img src="https://user-images.githubusercontent.com/10373447/46976517-11fdf180-d0a0-11e8-9b46-bcdfb9f05beb.jpg" width="30%"></img> <img src="https://user-images.githubusercontent.com/10373447/46977097-9bfa8a00-d0a1-11e8-983c-d7df8915c286.jpg" width="30%"></img> <img src="https://user-images.githubusercontent.com/10373447/46977190-e4b24300-d0a1-11e8-8d4e-b425ca09fba2.jpg" width="30%"></img> 

## Funcionalidades
Busquedas a traves del **NIS** de Usuario: El usuario tiene acceso en tiempo real a parámetros como potencia activa, demanda maxima y las corrientes de linea. La visualización de otro tipo de parametros está restringida en las configuraciones del MCU - ver `psoc branch`

<img src="https://user-images.githubusercontent.com/10373447/46982495-c739a500-d0b2-11e8-94f6-8f46e1c221b5.gif" width="90%"></img>


Busquedas por geolocalización: Marque un punto y arrastre sobre el mapa para acceder a los datos de una zona. Útil para analizar la demanda por regiones, generar reportes y estudios para crecimientos a futuro. Al guardar la zona, el sistema recolecta la información periodicamente para luego generar graficos estadisticos. Otra utilizad posible sería la de relacionar los medidores a un transformador, para evaluar los picos y la sobrecarga de la maquina electrica.

<img src="https://user-images.githubusercontent.com/10373447/46985162-4af98e80-d0bf-11e8-8633-84ec963cc12c.gif" width="90%"></img> 

<img src="https://user-images.githubusercontent.com/10373447/46985600-a9277100-d0c1-11e8-9174-65234dacecc6.gif" width="90%"></img> 
