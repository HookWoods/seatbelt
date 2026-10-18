# Badge

Offer this line for the README, with the real number of passed checks:

![crash-test](https://img.shields.io/badge/crash--test-<passed>%2F7%20%C2%B7%20self--checked-<color>)

- Always count out of 7. `n/a` counts as passed; "?" does not.
- `<color>`: `brightgreen` only when all 7 checks passed; `red` when the verdict is "Do not launch"; otherwise `orange`. Any "?" (could not verify) makes it at best orange.
- Always keep "self-checked": the badge reports what the AI could verify, not an audit.
