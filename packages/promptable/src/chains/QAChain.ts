import { NoopParser, Parser } from "@prompts/Parser";
import { Prompt } from "@prompts/Prompt";
import { CompletionsModelProvider } from "@providers/ModelProvider";
import { Document, LLMChain } from "src";
import { CombineDocumentsChain } from "./CombineDocumentsChain";

/**
 *
 * A QA Chain allows you to ask a question and get an answer from a model.
 *
 * It's composed of a few parts:
 * - a set of documents to search for an answer
 * - a chain to run to generate a answer
 *
 */
export class QAChain {
  constructor(
    public documents: Document[],
    public combineDocumentsChain: CombineDocumentsChain,
    public answerQuestion: LLMChain<"question" | "document">
  ) {}

  protected async _run(question: string) {
    const combinedDocuments = await this.combineDocumentsChain.run(
      this.documents
    );
    const answer = await this.answerQuestion.run({
      question,
      document: combinedDocuments.content,
    });

    return answer;
  }

  async run(question: string) {
    return await this._run(question);
  }
}
