import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const asklyIndex = pc.index('askly');


export const createMemory = async ({vectors,metadata, messageId})=>{
      await asklyIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata
      }])
}



export const queryMemory= async ({queryVector,limit=5,metadata})=>{
    const data = await asklyIndex.query({
        vector:queryVector,
        topK:limit,
        filter:metadata?metadata: undefined,
        includeMetadata:true
    });

    return data.matches
}