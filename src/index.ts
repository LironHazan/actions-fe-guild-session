import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { exec } from "@actions/exec";
import {GitHub} from "@actions/github/lib/utils";

const ghToken = getInput("ghToken");

(async () =>
    await run()
)()

async function runCowsayCli(what: string): Promise<string> {
    let output = '';
    await exec('npx', ['cowsay', what], {
        listeners: {
            stdout: (data: Buffer) => {
                output += data.toString();
            }
        }
    });
    return output;
}

async function getComment(octokit:  InstanceType<typeof GitHub>): Promise<any> {
    // Check if a comment already exists for this PR from the bot
    const commentsResult = await octokit.rest.issues.listComments({
        repo: context.repo.repo,
        owner: context.repo.owner,
        issue_number: context.payload.pull_request?.number as number,
    });
    return commentsResult.data.find(comment => comment.user?.login === context.actor);
}

async function run() {
    if (!ghToken || !context.payload.pull_request) return;

    const octokit = getOctokit(ghToken)
    console.log('Pr_number', context.payload.pull_request?.number)
    const prevComment = await getComment(octokit)

    let output = await runCowsayCli('Your code is moognificant  ☀️');
    const commentBody = String(output).trim();

    console.log(!!commentBody)
    console.log(prevComment.id)

    !!prevComment ? await octokit.rest.issues.updateComment({
        repo: context.repo.repo,
        owner: context.repo.owner,
        comment_id: prevComment.id,
        body: commentBody
    }) :
        await octokit.rest.issues.createComment({
            repo: context.repo.repo,
            owner: context.repo.owner,
            issue_number: context.payload.pull_request.number,
            body: commentBody
        })
}
