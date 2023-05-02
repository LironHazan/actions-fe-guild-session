"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const exec_1 = require("@actions/exec");
const ghToken = (0, core_1.getInput)("ghToken");
(async () => await run())();
async function runCowsayCli(what) {
    let output = '';
    await (0, exec_1.exec)('npx', ['cowsay', what], {
        listeners: {
            stdout: (data) => {
                output += data.toString();
            }
        }
    });
    return output;
}
const COMMENT_ID = 'Your code is moognificant';
async function getComment(octokit) {
    var _a;
    // Check if a comment already exists for this PR from the bot
    const commentsResult = await octokit.rest.issues.listComments({
        repo: github_1.context.repo.repo,
        owner: github_1.context.repo.owner,
        issue_number: (_a = github_1.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number,
    });
    return commentsResult.data.find(comment => { var _a; return (_a = comment.body) === null || _a === void 0 ? void 0 : _a.includes(COMMENT_ID); });
}
async function run() {
    var _a;
    if (!ghToken || !github_1.context.payload.pull_request)
        return;
    const octokit = (0, github_1.getOctokit)(ghToken);
    console.log('Pr_number', (_a = github_1.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number);
    const prevComment = await getComment(octokit);
    let output = await runCowsayCli(`${COMMENT_ID} ☀️`);
    const commentBody = String(output).trim();
    console.log(!!prevComment);
    console.log(prevComment.id);
    !!prevComment ? await octokit.rest.issues.updateComment({
        repo: github_1.context.repo.repo,
        owner: github_1.context.repo.owner,
        comment_id: prevComment.id,
        body: commentBody
    }) :
        await octokit.rest.issues.createComment({
            repo: github_1.context.repo.repo,
            owner: github_1.context.repo.owner,
            issue_number: github_1.context.payload.pull_request.number,
            body: commentBody
        });
}
