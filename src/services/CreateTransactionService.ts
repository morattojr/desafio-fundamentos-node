import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome') {
      if (total < value || !value) {
        throw Error(
          `You don't have suficient founds to complete the transaction`,
        );
      } else {
        this.transactionsRepository.outcome += value;
      }
    } else {
      this.transactionsRepository.income += value;
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    this.transactionsRepository.total =
      this.transactionsRepository.income - this.transactionsRepository.outcome;

    return transaction;
  }
}

export default CreateTransactionService;
