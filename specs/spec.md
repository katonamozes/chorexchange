# 1. Overview

## 1.1 Description

- App name: ChoreLoop
- Project goals and objectives:
  - Make household help exchangeable without cash: members offer chores, request nearby help, and settle in credits.
  - Give the first 1,000 members a 100-credit welcome balance so the marketplace can start with real liquidity.
  - Keep each exchange clear from offer through completion, with visible credit impact.

# 2. Requirements

## 2.1 Roles and Permission

| Role ID | Display Name | Description | Permission |
|---|---|---|---|
| root | Root | Full Access | Full access for application development. |
| chore_member | Chore Member | A participating member of the chore exchange. | Can join with a profile, browse chores, post chores, claim chores, and complete exchanges. |

## 2.2 User Story

| US ID | As a | I want to | So that |
|---|---|---|---|
| US-01 | Chore Member | to join ChoreLoop and receive the launch credit grant | I can ask for help before I have earned credits. |
| US-02 | Chore Member | to browse nearby chores with clear credit values | I can choose help that fits my time and skills. |
| US-03 | Chore Member | to post a chore I need done | someone nearby can exchange time for credits. |
| US-04 | Chore Member | to claim and complete a chore | the exchange has a clear handoff and credit result. |
| US-05 | Chore Member | to message the other exchange participant after a chore is accepted | we can arrange timing, access, and other details. |

## 2.3 First-Version Commitments

| FC ID | Capability | Minimum User Path | Related US |
|---|---|---|---|
| FC-01 | Launch welcome credit | Join form -> profile and neighborhood -> saved member -> 100-credit balance while the first-1,000 cap remains | US-01 |
| FC-02 | Nearby chore board | Home/Discover -> browse seeded and member chores -> filter by category -> open a chore -> claim it | US-02 |
| FC-03 | Post a chore | Post a chore -> title, category, neighborhood, credits, timing -> saved offer -> visible on board as Open | US-03 |
| FC-04 | Exchange completion | My Chores -> claimed chore -> mark complete -> exchange event and credit movement -> Completed state | US-04 |
| FC-05 | Credit activity | Activity -> view welcome, earned, and spent entries -> current balance and running total | US-01, US-04 |
| FC-06 | Post-claim coordination chat | My Chores -> open an accepted chore -> read and send persisted messages with the poster/helper -> completed threads remain readable | US-05 |

# 3. Data Models

## 3.1 Member Profile

- Description: A gateway-authenticated participant's local exchange profile and credit balance.

| Field Name | Definition | Notes |
|---|---|---|
| Member ID | Stable gateway user reference | Required and unique. |
| Display Name | Name shown to nearby members | Required. |
| Neighborhood | Local area used for matching | Required. |
| Credits | Current spendable credit balance | Never below zero for a spend. |
| Welcome Grant | Whether the 100-credit launch grant was issued | Issued once only if member is among the first 1,000. |
| Joined At | Time the member profile was created | Used for launch-order counting. |

## 3.2 Chore Offer

- Description: A requested or offered household task moving through the exchange lifecycle.

| Field Name | Definition | Notes |
|---|---|---|
| Chore ID | Unique offer identifier | Required. |
| Title | Short task name | Required. |
| Category | Cleaning, errands, pet and plant care, moving and setup, yard care, computer help, house maintenance, furniture assembly, painting and decorating, plumbing help, electrical help, appliance help, moving and lifting, delivery and pickup, grocery shopping, meal preparation, laundry and ironing, childcare, elder companionship, tutoring and homework, administrative help, event setup and cleanup, organization and decluttering, recycling and donation drop-off, or snow and ice removal | Required. |
| Neighborhood | Area where the task happens | Required. |
| Credits | Credits exchanged on completion | Positive whole number. |
| Timing | Human-readable preferred timing | Required. |
| Details | Instructions and context | Optional. |
| Posted By | Member who requested the task | Required. |
| Claimed By | Member who accepted it | Empty until claimed. |
| Status | open / claimed / completed / cancelled | Only open chores can be claimed; only claimed chores can be completed. |

## 3.3 Chore Message

- Description: A persisted coordination message between the member who posted a chore and the member who accepted it.

| Field Name | Definition | Notes |
|---|---|---|
| Message ID | Unique message identifier | Required. |
| Chore ID | Related chore offer | Required. |
| Sender ID | Poster or accepted helper who sent the message | Required; only exchange participants may read or send. |
| Body | Coordination text | Required, trimmed, and limited to 2,000 characters. |
| Created At | Time the message was recorded | Read-only. |

## 3.4 Exchange Event

- Description: An immutable visible record of credit movement and lifecycle action.

| Field Name | Definition | Notes |
|---|---|---|
| Event ID | Unique activity identifier | Required. |
| Member ID | Member whose balance changed | Required. |
| Chore ID | Related chore when applicable | Nullable for welcome grant. |
| Kind | welcome / earned / spent | Required. |
| Amount | Signed credit movement | Welcome and earned are positive; spent is negative. |
| Note | Human-readable reason | Required. |
| Created At | Time the event was recorded | Read-only. |

# 4. Business Logic

## 4.1 Launch Welcome Grant

- Related user story: US-01
- Trigger: An authenticated person submits the Join ChoreLoop form.
- Logic:
  1. Validate display name and neighborhood, then check whether a profile already exists for the gateway identity.
  2. Create the profile and count existing profiles in joined order.
  3. If the profile is within the first 1,000, set credits to 100 and record one welcome event; otherwise set credits to 0 and show the member their waitlist status.
  4. Return the profile, current balance, and whether the grant was awarded.
- Output: A joined profile and visible credit balance.

## 4.2 Claim and Complete Exchange

- Related user story: US-02, US-04
- Trigger: A member selects an open chore from the board.
- Logic:
  1. Validate the chore exists, is open, and is not owned by the claiming member.
  2. Mark the chore claimed by the member and show both parties the handoff state.
  3. The chore owner can mark a claimed chore complete; the claimant earns the listed credits and the owner spends the same amount in one transaction.
  4. Record the exchange event(s) and reject completion if either member or the chore is no longer in the expected state.
- Output: Completed chore, updated balances, and visible activity history.

## 4.3 Post-Claim Coordination Chat

- Related user story: US-05
- Trigger: A member accepts an open chore.
- Logic:
  1. Make a persisted conversation available to the poster and accepted helper from My Chores.
  2. Allow only those two participants to read the thread; messages are chronological and show the sender and timestamp.
  3. Allow new messages while the chore is claimed, with trimmed nonblank text up to 2,000 characters.
  4. Keep the conversation readable after completion, but make it read-only.
- Output: A durable coordination thread that survives reloads and protects participant privacy.

## 4.4 Post Chore Offer

- Related user story: US-03
- Trigger: A joined member submits a new chore form.
- Logic:
  1. Require title, category, neighborhood, timing, and a positive whole-number credit value.
  2. Save the offer as open and associate it with the posting member.
  3. Show the new offer at the top of the member's chore board.
- Output: An open chore offer available for nearby members to claim.

# 5. UI

## 5.1 Home Dashboard

- Purpose: Give a member an immediate view of their balance, launch grant status, and next available exchange.
- Key Elements: Welcome hero, join CTA for unjoined users, balance card, first-1,000 progress indicator, nearby open chores, and links to Discover and Post a chore.
- User Interaction Flow: A visitor submits Join ChoreLoop; the page saves the profile and replaces the CTA with their balance. A joined member selects a chore to claim or opens the post flow.
- Validation Rules: Join requires display name and neighborhood. A duplicate join returns the existing profile without issuing another grant.

## 5.2 Discover Chores

- Purpose: Browse and claim chores nearby.
- Key Elements: Category filter, open chore cards with neighborhood, timing, credits, poster, and claim action.
- User Interaction Flow: Filter the board -> inspect a chore -> confirm claim -> see claimed state and feedback.
- Validation Rules: Only open chores can be claimed; a member cannot claim their own chore.

## 5.3 My Chores, Coordination, and Activity

- Purpose: Track posted/accepted chores, arrange details with the other exchange participant, and understand credit movement.
- Key Elements: Posted and accepted status groups, completion action for owned claimed chores, participant-only chat for claimed/completed chores, current balance, and chronological activity ledger.
- User Interaction Flow: Open My Chores -> open an accepted chore's conversation -> exchange timing/access details -> owner marks the chore complete -> see Completed state and earned/spent entries in Activity.
- Validation Rules: Only the posting member can complete a claimed chore. Only the poster and accepted helper can read or send messages. Messages are disabled after completion.

## 5.4 Post a Chore

- Purpose: Turn a household need into an exchange offer.
- Key Elements: Chore title, category, neighborhood, preferred timing, credit amount, details, and submit action.
- User Interaction Flow: Enter task details -> submit -> receive confirmation -> see the open offer on Discover and My Chores.
- Validation Rules: Required text cannot be blank; credit amount must be a positive whole number; only joined members may post.
