import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function Politicas() {
  const [showDialog, setShowDialog] = useState(true);
  const navigate = useNavigate();

  const handleAccept = () => {
    setShowDialog(false);
    // Aquí puedes agregar lógica adicional después de aceptar
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Términos y Condiciones de ECUCONDOR
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Antes de continuar, es importante que lea y comprenda nuestras políticas de servicio. 
              Su aceptación implica el compromiso de cumplir con nuestros procedimientos establecidos.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-6 text-slate-700">
              <section>
                <h3 className="font-semibold text-lg mb-2">1. Verificación de Identidad</h3>
                <p>
                  Para garantizar la seguridad de todas las operaciones, ECUCONDOR requiere:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Documento de identidad válido y vigente</li>
                  <li>Comprobante de domicilio reciente</li>
                  <li>En caso de empresas, documentación comercial adicional</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">2. Proceso de Transacciones</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Las operaciones se procesan en orden de llegada</li>
                  <li>Tiempo de procesamiento estimado: máximo 2 horas hábiles</li>
                  <li>Horario de operaciones: Lunes a Viernes de 9:00 a 18:00</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">3. Documentación de Operaciones</h3>
                <p>
                  Todas las transferencias deben estar respaldadas por comprobantes claros y legibles que incluyan:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Nombre completo del ordenante</li>
                  <li>Monto exacto de la transferencia</li>
                  <li>Fecha y hora de la operación</li>
                  <li>Número de referencia bancaria</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">4. Limitaciones y Responsabilidades</h3>
                <p>
                  ECUCONDOR establece los siguientes parámetros operativos:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Monto mínimo por operación: USD 100 o equivalente</li>
                  <li>Monto máximo según verificación previa del cliente</li>
                  <li>Los tiempos bancarios están sujetos a las entidades financieras</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">5. Comunicación y Soporte</h3>
                <p>
                  Canales oficiales de atención:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>WhatsApp: +54 911 6659-9559</li>
                  <li>Correo: ecucondor@gmail.com</li>
                  <li>Horario de atención: 9:00 a 18:00 (hora local)</li>
                </ul>
              </section>

              <section className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-blue-800">
                  Aviso de Seguridad
                </h3>
                <p className="text-blue-700">
                  ECUCONDOR nunca solicitará contraseñas, códigos de verificación ni datos sensibles 
                  por medios no oficiales. Toda comunicación debe realizarse a través de nuestros 
                  canales verificados.
                </p>
              </section>
            </div>
          </ScrollArea>

          <DialogFooter className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-500">
              Al hacer clic en "Acepto", confirma haber leído y comprendido nuestras políticas.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="px-8"
              >
                Volver
              </Button>
              <Button 
                onClick={handleAccept}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Acepto
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Políticas de ECUCONDOR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 mb-4">
                Gracias por aceptar nuestras políticas. Puede revisar los términos y condiciones en cualquier momento.
              </p>
              <Button 
                onClick={() => navigate("/")}
                variant="outline"
                className="mt-4"
              >
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
