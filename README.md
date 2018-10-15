# stbd
Trabajo de Grado para la obtención del título de Ingeniero en Electrónica con énfasis en teleprocesamiento de la información.
----
El proyecto se enfoca en la etapa de distribucion de una red electrica, aplicado a usuarios de la Administración Nacional de Distribución de Energía **ANDE**.

## Prototipo

Dispositivo IOT que sincroniza los registros de los medidores capaces de soportar los protocolos IEC 62056. Construido con arreglos de transistores y transductores de luz. Los datos son enviados periodicamente, empleando websockets, al centro de monitoreo.

### Partes del Proyecto
* Sensor: MCU de 32 bits - ARM Cortex M0 PSoC 4
* Modulo Inalambrico: Xbee, maneja el protocolo zig bee para redes en mesh
* Concentrador: Raspberry Pi B+ con conexión a internet. La Función del concentrado es reenviar los datos recolectados al centro de supervisión, soporta un total de 256 nodos conectados.
* Aplicativo: Desarrollado en nodeJS y Angular. Actualemnete descontinuado. El aplicativo se desarrolló para mostrar las funcionalidades posibles que pueden aplicarse al explotar los datos recolectados. Analisis predictivo de la red, facturación, alertas y supervisión de los elementos que conforman el sistema

<img src="https://user-images.githubusercontent.com/10373447/46976517-11fdf180-d0a0-11e8-9b46-bcdfb9f05beb.jpg" width="30%"></img> <img src="https://user-images.githubusercontent.com/10373447/46977097-9bfa8a00-d0a1-11e8-983c-d7df8915c286.jpg" width="30%"></img> <img src="https://user-images.githubusercontent.com/10373447/46977190-e4b24300-d0a1-11e8-8d4e-b425ca09fba2.jpg" width="30%"></img> 

## Funcionalidades
Busquedas a traves del **NIS** de Usuario: El usuario tiene acceso en tiempo real a parámetros como potencia activa, demanda maxima y las corrientes de linea. La visualización de otro tipo de parametros está restringida en las configuraciones del MCU - ver `psoc branch`
