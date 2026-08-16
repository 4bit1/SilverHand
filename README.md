# Skill Share Connect

Build ONLY the new Seller + Buyer expertise features described below inside my EXISTING ElderSkill website.

IMPORTANT:

This is an existing production-style application.

DO NOT rebuild the website.

DO NOT redesign existing pages.

DO NOT change existing authentication.

DO NOT change the existing voice onboarding.

DO NOT change the existing AI profile generation.

DO NOT change existing navigation unless adding the new required links.

DO NOT create unrelated features.

Reuse the existing components, authentication, user/profile data, API layer, database and design system wherever possible.

==================================================

ELDERSKILL NEW FEATURE

==================================================

The new feature connects two sides:

SELLER

Experienced person who shares knowledge, tutorials and services.

BUYER

Employer/person who wants to hire the seller, learn from them, or have a 1:1 conversation.

The experience must feel like a natural extension of ElderSkill.

==================================================

BRAND

==================================================

Use the existing ElderSkill colors:

Primary:    #6B7A3E

Background: #FFFDF5

Accent:     #C98C3A

Text:       #2F312B

Design style:

Human

Warm

Minimal

Premium

Professional

Accessible

Trustworthy

Avoid:

neon

cyberpunk

AI gradients

purple/blue AI styling

excessive glassmorphism

excessive shadows

over-designed cards

Do not introduce a new visual system.

==================================================

PART A — SELLER

==================================================

Create ONE new seller page.

Use the navigation name:

"Teach & Share"

Purpose:

Allow the experienced person to:

1. Add tutorials

2. Manage existing tutorials

3. Set availability

4. Manage upcoming sessions

--------------------------------------------------

SELLER PAGE

--------------------------------------------------

Header:

Teach & Share

Subtitle:

"Share what you know and help others learn from your experience."

Primary action:

Add Tutorial

Secondary action:

Manage Availability

--------------------------------------------------

ADD TUTORIAL

--------------------------------------------------

Use a subtle circular "+" button.

Appearance:

light grey

low opacity

minimal shadow

premium floating action style

Do not use a large colorful button.

Clicking it opens the tutorial creation flow.

Collect only the information required for a useful tutorial:

- title

- video

- thumbnail

- short description

- what learners will learn

- step-by-step instructions

- duration

- difficulty

- language

- price/free

- publish status

Allow multiple tutorial steps.

Each step:

Title

Description

Optional image/video

Actions:

Add step

Edit

Delete

Reorder

--------------------------------------------------

TUTORIAL MANAGEMENT

--------------------------------------------------

Show seller tutorials in a clean list/grid.

Each tutorial:

Thumbnail

Title

Duration

Price/free

Status

Actions:

Edit

Preview

Publish/Unpublish

Delete

Statuses:

Draft

Published

Unpublished

Do not build analytics or creator dashboards.

--------------------------------------------------

SELLER AVAILABILITY

--------------------------------------------------

Create a simple availability section.

Seller can specify:

day

start time

end time

For:

1. Free 30-minute discovery sessions

2. Paid/tutorial sessions

Allow recurring weekly availability.

Allow specific date overrides if the existing backend already supports them.

Prevent overlapping slots.

Prevent booking outside seller availability.

--------------------------------------------------

SELLER UPCOMING SESSIONS

--------------------------------------------------

Show:

Buyer

Session type

Date

Time

Status

Actions:

View

Reschedule

Cancel

Keep this simple.

==================================================

PART B — BUYER

==================================================

Create ONE buyer-facing page connected to an experienced person's existing profile.

Page name:

"Their Expertise"

Purpose:

Let the buyer understand what the experienced person offers and choose:

1. Hire them

2. Learn from their tutorials

3. Book a free 30-minute conversation

--------------------------------------------------

PROFILE HEADER

--------------------------------------------------

Show existing profile information:

Name

Primary skill

Experience

Location

Languages

Verification status if already available

Use the existing profile data.

Do not duplicate profile-generation logic.

--------------------------------------------------

SERVICES

--------------------------------------------------

Section:

"Work With Them"

Display the seller's available services.

Each service:

Name

Short description

Relevant skill

Price if available

Availability

Actions:

"Hire for this work"

"Learn this skill"

Do not implement a complete marketplace/payment system here unless one already exists.

--------------------------------------------------

TUTORIALS

--------------------------------------------------

Section:

"Learn From Their Experience"

Display published tutorials only.

Each tutorial:

Thumbnail

Title

Short description

Duration

Difficulty

Language

Price/free

Action:

View Tutorial

If paid:

Buy Tutorial

If free:

Start Learning

Reuse the existing payment system if already present.

Do not create a new payment infrastructure.

==================================================

PART C — FREE 1:1 DISCOVERY SESSION

==================================================

Add a dedicated section:

"Meet Them — Free 30-Minute Conversation"

Description:

"Have a short conversation before deciding whether you'd like to work with them or learn from their experience."

Button:

Book a Free 30-Minute Session

--------------------------------------------------

BOOKING FLOW

--------------------------------------------------

Buyer selects:

Date

Available time

ONLY show times provided by the seller.

Session duration:

30 minutes

Example:

Friday

10:00 AM

10:30 AM

2:00 PM

4:30 PM

Do not show unavailable slots as selectable.

Then:

Confirm Booking

--------------------------------------------------

BOOKING CONFIRMATION

--------------------------------------------------

After successful booking show:

"Your conversation is booked."

Display:

Seller

Date

Time

Duration

Session purpose

Add the booking to the existing buyer booking area if one exists.

Reuse existing notification functionality if available.

==================================================

PART D — MEETING

==================================================

For the free session:

Create a unique meeting session through the existing backend meeting mechanism.

Do NOT create permanent public meeting links.

Meeting access must belong to:

buyer

seller

booking

The free session duration is exactly:

30 minutes

The backend must enforce expiration.

The frontend timer is only a visual representation.

--------------------------------------------------

UPCOMING SESSION

--------------------------------------------------

Show:

Seller

Session type

Date

Time

Status

Before session:

"Upcoming"

When the session becomes joinable:

"Join Conversation"

Use a subtle ElderSkill-colored active state.

No neon glow.

--------------------------------------------------

FREE SESSION TIMER

--------------------------------------------------

During the free session display:

30:00

Countdown from the actual scheduled start time.

At 00:00:

"This conversation has ended."

Disable joining after expiration.

Do not rely only on frontend JavaScript for expiration.

==================================================

PART E — PAID / TUTORIAL SESSION

==================================================

If the buyer has access to a paid tutorial/session:

The seller controls the schedule.

Seller can set:

Date

Start time

End time

Description

Buyer sees:

"Upcoming Learning Session"

with:

Date

Time

Description

Join

Unlike the free discovery call, the duration is NOT fixed at 30 minutes.

The seller-defined start/end time controls the session.

Reuse existing payment/access functionality if it exists.

Do not build a new payment system.

==================================================

PART F — BOOKING STATES

==================================================

Use:

AVAILABLE

CONFIRMED

UPCOMING

JOINABLE

IN_PROGRESS

COMPLETED

CANCELLED

EXPIRED

Keep the state handling simple and deterministic.

==================================================

PART G — RESPONSIVE DESIGN

==================================================

The new pages must work on:

Mobile

Tablet

Desktop

Mobile:

- responsive tutorial cards

- bottom-sheet booking selector

- large touch-friendly time slots

- prominent Join button

- no horizontal scrolling

Desktop:

Use efficient two-column layouts where useful.

Do not create separate desktop/mobile applications.

==================================================

PART H — ACCESSIBILITY

==================================================

Because ElderSkill serves older adults:

Use:

large readable typography

clear labels

large touch targets

keyboard navigation

visible focus

good contrast

simple instructions

minimal cognitive load

Do not hide important actions behind complicated interactions.

==================================================

PART I — DATA INTEGRATION

==================================================

IMPORTANT:

Use the EXISTING database and API structure.

Before creating anything:

1. Inspect existing user/profile structure.

2. Inspect existing authentication.

3. Inspect existing API/service patterns.

4. Inspect existing booking/payment/meeting functionality if present.

5. Reuse existing tables/components/services where possible.

Only add the minimum required data structures.

Conceptual entities:

tutorials

tutorial_steps

availability

bookings

meeting_sessions

Do NOT duplicate existing entities.

Do NOT create fake databases.

==================================================

PART J — API INTEGRATION

==================================================

Follow the existing application's API architecture.

If equivalent endpoints already exist, reuse them.

Only create missing operations required for:

Tutorial:

create

read

update

delete

publish

Availability:

create

update

delete

list

Booking:

list availability

create booking

cancel booking

Meeting:

create session

validate access

join session

Do not hard-code backend URLs.

==================================================

PART K — SECURITY

==================================================

Backend must validate:

seller ownership of tutorials

seller ownership of availability

buyer ownership of bookings

meeting participant authorization

session timing

booking conflicts

Never trust frontend state for security.

Never expose private meeting credentials.

==================================================

PART L — EMPTY / LOADING / ERROR STATES

==================================================

Implement only the necessary states.

Seller has no tutorials:

"You haven't shared a tutorial yet."

Button:

"Add your first tutorial"

No availability:

"Set your available times so people can book a conversation with you."

Buyer has no tutorials:

"This person hasn't published tutorials yet."

No available 1:1 slots:

"No free conversation times are available right now."

Errors should be human-readable.

Never show raw API errors.

==================================================

PART M — IMPORTANT SCOPE LIMIT

==================================================

DO NOT build:

- new AI models

- voice AI

- profile generation

- vector search

- employer matching

- payment infrastructure

- chat/messaging

- social feed

- recommendation engine

- analytics dashboard

- admin dashboard

- complex calendar system

Those already exist or are separate product modules.

This task is ONLY:

SELLER:

Teach & Share

Tutorials

Availability

Upcoming sessions

BUYER:

Their Expertise

Services

Tutorials

Free 30-minute booking

Meeting join

Paid/tutorial session scheduling

==================================================

IMPLEMENTATION STRATEGY

==================================================

Build incrementally.

FIRST:

Create the Seller "Teach & Share" page and connect it to existing profile/authentication.

SECOND:

Implement tutorial CRUD and publishing.

THIRD:

Implement seller availability.

FOURTH:

Create Buyer "Their Expertise".

FIFTH:

Display services and tutorials.

SIXTH:

Implement free 30-minute booking.

SEVENTH:

Connect meeting session creation/join.

EIGHTH:

Implement paid/tutorial session scheduling.

Do not modify unrelated parts of the application.

==================================================

FINAL ACCEPTANCE TEST

==================================================

SELLER:

Login

→ Teach & Share

→ Add Tutorial

→ Upload video

→ Add description

→ Add steps

→ Publish

→ Set availability

BUYER:

Open seller profile

→ Their Expertise

→ View services

→ View tutorials

→ Hire OR Learn

→ Book Free 30-Minute Conversation

→ Select seller's available slot

→ Confirm

→ See upcoming booking

→ Return at scheduled time

→ Join Conversation

→ Session expires after 30 minutes

PAID/TUTORIAL:

Seller sets session time

→ Buyer gets access

→ Buyer sees upcoming session

→ Join becomes available at correct time

→ Seller-defined duration controls session

==================================================

FINAL RULE

==================================================

Make the smallest production-quality implementation necessary to complete these features.

Prefer REUSE over NEW CODE.

Prefer SIMPLE over COMPLEX.

Prefer EXISTING SERVICES over DUPLICATION.

Do not add features just because they are technically possible.

The final result must look and behave as though these features were always part of ElderSkill.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/930e1897-0ea0-4dd6-a5db-8c0a333976a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
