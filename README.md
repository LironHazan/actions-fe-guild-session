DIY it's easy - GHA in Typescript

---

As part of js fatigue sessions aimed for the FE/FS Guild (@SentinelOne)

---

**Agenda:**

- Briefly go over on core concepts
- Briefly go over types of custom actions
  - Example of a "composite" action
- Using `actions/github-script@v6`
- Creating own action in typescript!

---

**Composite**

Example of the composite action is located under [`.github/actions/composite-example`](https://github.com/LironHazan/actions-fe-guild-session/blob/master/.github/actions/composite-example/action.yml)
and used by [`test_composite_action.yml`](https://github.com/LironHazan/actions-fe-guild-session/blob/master/.github/workflows/use_composite_action.yml)

**Inline script example**

```yaml
- name: Greet
  uses: actions/github-script@v6
  with:
    script: |
      const prNumber = context.payload.pull_request.number;
      const actor = context.actor;
      const comment = `
      👋 Hello @${actor}! 
          What a nice code you contributed!
      `;
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: comment
      });
```

**Creating own action in typescript**

Example of the custom action use [`.github/workflow/use_custom_ts_action.yml`](https://github.com/LironHazan/actions-fe-guild-session/blob/master/.github/workflows/use_custom_ts_action.yml)
