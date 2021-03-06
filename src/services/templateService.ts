import { GitPullRequest } from "TFS/VersionControl/Contracts";
import { ITemplate, IActionPullRequest } from "../models/interfaces";
import { VersionControlActionService } from "TFS/VersionControl/Services";
import { GitHttpClient4_1, getClient, GitHttpClient4 } from "TFS/VersionControl/GitRestClient";

const newLine = "\n";
const twoNewLines = newLine + newLine;

export class ApplyTemplateService {
    public applyTemplates(pullRequest: IActionPullRequest, templates: ITemplate[]): Promise<void> {
        const currentDescription = pullRequest.description;

        const updatedDescription = `${currentDescription} ${twoNewLines} ${this.formatTemplates(templates)}`;

        const client = this.getClient();

        return new Promise<void>((resolve, reject) =>
            client.updatePullRequest({
                description: updatedDescription
            } as any, pullRequest.repositoryId, pullRequest.pullRequestId)
                .then<void>(() => resolve(), reject));
    }

    private getClient(): GitHttpClient4 {
        return getClient();
    }

    private formatTemplates(templates: ITemplate[]): string {
        return templates
            .map(template => `### ${template.name} ${twoNewLines} ${template.template}`)
            .join(`${twoNewLines}`)
    }
}