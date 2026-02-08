# Optional Apps Audit (social, matchmaking, rewards, meus)

## Current state

These four apps are in `INSTALLED_APPS` and have URL routes under `/api/v1/`:

| App          | URL prefix           | Models / purpose                          | Usage in codebase                    |
|-------------|----------------------|-------------------------------------------|--------------------------------------|
| social      | `/api/v1/social/`    | Connection, Interaction, SocialGroup     | Only `seed_data` creates data        |
| matchmaking | `/api/v1/matchmaking/` | Match, MatchPreference                 | Only `seed_data` creates data        |
| rewards     | `/api/v1/rewards/`   | Reward, UserReward, Achievement, etc.     | Only `seed_data` creates data        |
| meus        | `/api/v1/meus/`      | EntityProfile, EntityRelationship, etc.  | meus services + seed_data            |

There is no evidence of production UI flows or main product features calling these APIs.

## Recommendations

1. **Product confirmation**  
   Confirm whether these features are shipped, in roadmap, or deprecated.

2. **If not in use**  
   - Remove their entries from `numerai/urls.py` (or guard behind feature flags).  
   - Stop seeding them in `seed_data`, or move that seeding to a separate “demo” seed command.  
   - Optionally mark their models as deprecated and plan removal or move to an “optional” app.

3. **If in use**  
   - Document which endpoints and flows use them.  
   - Ensure migrations are applied in all environments (e.g. analytics `user_activity_log` has been consolidated; ensure analytics migrations are run).

## No code changes in this pass

No URLs or seed logic were removed in the schema redesign. This doc is for follow-up audit and product decision.
