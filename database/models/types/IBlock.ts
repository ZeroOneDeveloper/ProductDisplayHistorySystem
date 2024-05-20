import ITransaction from "./ITransaction";

interface IBlock {
  genesis?: boolean;
  index: number;
  previousHash?: string;
  nonce: number;
  difficulty: number;
  transactions: ITransaction[];
}

export default IBlock;
