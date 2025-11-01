import type { Request, Response } from 'express';
import * as credentialService from '../services/credential.service.ts';
interface User{
    id:string;
    name?:string;
    email?:string;
}

export interface AuthRequest extends Request{
    user?: User
}
// POST /api/v0/credentials/
export const createCredentialController = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, data } = req.body;
    const userId = req.user!.id; 

    if (!name || !type || !data) {
      return res.status(400).json({ message: "Missing required fields: name, type, data" });
    }

    const newCredential = await credentialService.createCredential(name, type, data, userId);
    //not returning data
    res.status(201).json({
        id: newCredential.id,
        name: newCredential.name,
        type: newCredential.type
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET /api/v0/credentials/
export const getCredentialsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const credentials = await credentialService.getCredentialsForUser(userId);
        res.status(200).json(credentials);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error lalala" });
    }
};

// DELETE /api/v0/credentials/:id
export const deleteCredentialController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params as {id:string};

        await credentialService.deleteCredential(id, userId);
        res.status(204).send(); 
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

