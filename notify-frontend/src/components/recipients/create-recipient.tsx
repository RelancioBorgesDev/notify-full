import CreateRecipientForm from "./create-recipient-form";

export default function CreateRecipient() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestão de Destinatários
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus destinatários de notificações e suas informações de
          contato.
        </p>
      </div>
      <div className="flex gap-2">
        <CreateRecipientForm />
      </div>
    </div>
  );
}
