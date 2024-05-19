interface ITransaction {
  index: number;
  senderId: number;
  targetId: number;
  targetPublicKey: string;
  productName: string;
  count: number;
  previousHash: string;
  processed: boolean;
}

export default ITransaction;
