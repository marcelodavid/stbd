# stbd
Trabajo de Grado para la obtención del título de Ingeniero en Electrónica con énfasis en teleprocesamiento de la información.
...
El proyecto se enfoca en la etapa de distribucion de una red electrica, aplicado a usuarios de la Administración Nacional de Distribución de Energía **ANDE**.

## Prototipo
...
Dispositivo IOT que sincroniza los registros de los medidores capaces de soportar los protocolos IEC 62056. Construido con arreglos de transistores y transductores de luz. Los datos son enviados periodicamente, empleando websockets, al centro de monitoreo.

### Partes del Proyecto
* Sensor: MCU de 32 bits - ARM Cortex M0 PSoC 4
* Modulo Inalambrico: Xbee, maneja el protocolo zig bee para redes en mesh
* Concentrador: Raspberry Pi B+ con conexión a internet. La Función del concentrado es reenviar los datos recolectados al centro de supervisión, soporta un total de 256 nodos conectados.
* Aplicativo: Desarrollado en nodeJS y Angular. Actualemnete descontinuado. El aplicativo se desarrolló para mostrar las funcionalidades posibles que pueden aplicarse al explotar los datos recolectados. Analisis predictivo de la red, facturación, alertas y supervisión de los elementos que conforman el sistema
