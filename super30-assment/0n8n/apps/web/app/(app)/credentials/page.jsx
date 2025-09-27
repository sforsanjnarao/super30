"use client"
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  

import {GmailCredentialForm}  from "./_component/GmailForm";
 import { TelegramCredentialForm } from "./_component/TelegramForm";


export default function CredentialsPage() {
    const [selectedNodeType, setSelectedNodeType] = useState(null);
    const [selectedCredential, setSelectedCredential]=useState(null)
    const [credentials, setCredentials] = useState([]);   


    const renderCredentialForm = () => {
        switch (selectedNodeType) {
          case "gmail":
            return <GmailCredentialForm />;
          case "telegram":
            return <TelegramCredentialForm />;
          default:
            return (
              <div className="mt-6 text-center text-muted-foreground">
                <p>Select a node type to create a credential.</p>
              </div>
            );
        }
      };

      useEffect(()=>{
        const fetchCreds=async ()=>{
            const response= await axios.get("http://localhost:3000/credentials/")
            if(!response) return console.log('network problem')
                const {data} =response
                setCredentials(data)
        }
        fetchCreds()
      },[])
    

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Credentials</CardTitle>
              <CardDescription>
                Manage and create your application credentials.
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Create Credential</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Node Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedNodeType("gmail")}>
                  Gmail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedNodeType("telegram")}
                >
                  Telegram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
        {credentials.length > 0 ? (
            <div className="flex flex-col gap-2">
              {credentials.map((cred) => (
                <Button
                  key={cred.id || cred._id}
                  variant="outline"
                  onClick={() => setSelectedCredential(cred)}
                >
                  {cred.name}
                </Button>
              ))}
            </div>
          ) : (
            <p>You have no credentials saved.</p>
          )}
          {selectedCredential && (
            <div className="mt-4 p-4 border rounded">
              <h2 className="font-bold">{selectedCredential.name}</h2>
              <pre>{JSON.stringify(selectedCredential, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedNodeType && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              Create{" "}
              {selectedNodeType.charAt(0).toUpperCase() +
                selectedNodeType.slice(1)}{" "}
              Credential
            </CardTitle>
            <CardDescription>
              Enter the required information for your {selectedNodeType} node.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderCredentialForm()}</CardContent>
        </Card>
      )}

    </div>
  );
}