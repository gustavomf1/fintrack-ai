import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { Transaction } from './entities/transaction.entity';

type Insight = {
  severity: 'info' | 'warning';
  message: string;
};

@Injectable()
export class InsightsService {
  private readonly ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async generate(transactions: Transaction[]): Promise<Insight[]> {
    if (transactions.length === 0) {
      return [{ severity: 'info', message: 'Sem transações para analisar.' }];
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: this.buildPrompt(transactions),
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ['info', 'warning'] },
              message: { type: Type.STRING },
            },
            required: ['severity', 'message'],
          },
        },
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response');
    }

    return JSON.parse(response.text);
  }

  private buildPrompt(transactions: Transaction[]) {
    return `Você é um assistente financeiro pessoal. Abaixo estão as transações do usuário no período.

Transações (JSON):
${JSON.stringify(
  transactions.map((t) => ({
    valor: t.amount,
    categoria: t.category,
    descricao: t.description,
    data: t.date,
  })),
)}

Gere de 2 a 4 insights curtos e diretos, em português, sobre os hábitos de gasto do usuário. Considere:
- Qual categoria concentra a maior parte dos gastos, e o percentual aproximado do total que isso representa.
- Transações individuais muito acima da média das demais, se houver.
- Padrões que mereçam atenção (ex: uma categoria dominando demais, gastos recorrentes que somam um valor alto).

Classifique cada insight como "info" (observação neutra) ou "warning" (algo que vale a pena o usuário rever). Todo insight "warning" deve terminar com uma recomendação prática e específica do que fazer a respeito, não só apontar o problema (ex: em vez de só dizer que uma categoria domina os gastos, sugira uma ação concreta relacionada a ela, como revisar a frequência de uso, buscar alternativas mais baratas ou renegociar um valor fixo).

Baseie-se apenas nos dados fornecidos, não invente números. Seja direto, sem saudação nem introdução.`;
  }
}
