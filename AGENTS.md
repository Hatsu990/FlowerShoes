# AGENTS.md

## Project Overview

This project is a website for "홍천 꽃신".

The project has two required goals:

1. Promotion
   - Build a homepage that introduces and promotes 홍천 꽃신.
   - Visitors should quickly understand what 홍천 꽃신 is.
   - The site should make the brand/service feel trustworthy, warm, and easy to approach.

2. Marketing / Reservation / Automation
   - Build a reservation flow.
   - Prepare the structure for future automation.
   - Reservation, inquiry, customer management, and notification features should be considered from the beginning.

Additional features may be proposed and implemented based on developer ideas.

## Core Product Direction

This is not just a static homepage.

The site should work as a promotional landing page and also as a reservation/marketing system.

The minimum required result should include:

- Homepage
- Service introduction
- Reservation call-to-action
- Reservation request flow
- Basic reservation data structure
- Basic admin confirmation structure
- Mobile responsive layout
- Future automation-ready architecture

## Required Main Features

### Promotion Homepage

The homepage should include:

- Hero section
- Short introduction of 홍천 꽃신
- Service/product explanation
- Image or gallery section
- Location/contact section
- Reservation/inquiry call-to-action
- Mobile-friendly layout

### Reservation

The reservation flow should include:

- Customer name
- Phone number
- Desired date
- Desired time
- Number of people or quantity if needed
- Request memo
- Submit result / confirmation message

### Admin / Management

Prepare a simple admin-side structure for checking reservations.

At MVP stage, this can be simple.

Examples:

- Reservation list
- Reservation detail
- Reservation status
- Basic memo field

### Automation Readiness

The code structure should allow future automation such as:

- Reservation confirmation message
- KakaoTalk notification
- SMS notification
- Email notification
- Admin alert
- Customer follow-up message
- Marketing campaign message
- Reservation status update notification

Do not fully implement paid/external APIs unless requested.
But design the structure so they can be added later.

## Development Philosophy

Development speed is very important.

Do not split work into tiny tasks.

Prefer large integrated feature work.

When possible, implement a complete feature flow in one iteration.

Example:

Do not separately implement only:
- reservation button
- reservation form
- database schema
- admin page

Instead, prefer implementing the entire reservation MVP flow together:

- reservation UI
- validation
- data model
- API route
- storage
- admin list
- basic status handling
- responsive layout

## MVP First

Build the simplest working version first.

Prioritize:

1. Working result
2. Fast implementation
3. Clear structure
4. Easy future expansion
5. Refactoring later

Avoid:

- Overengineering
- Excessive abstraction
- Too many confirmation questions
- Tiny fragmented tasks
- Perfect architecture before working prototype

## Workflow Rules

- Bundle related tasks together.
- Reduce unnecessary back-and-forth.
- Make reasonable assumptions when details are missing.
- Explain important assumptions briefly.
- Create missing project files when needed.
- Keep implementation practical.
- Prefer end-to-end working features.
- After implementation, summarize changed files and next steps.

## UX Rules

- Mobile-first design is important.
- Reservation should be easy to find.
- Contact/inquiry should be easy to access.
- Users should understand the site purpose within 5 seconds.
- The homepage should guide users naturally toward reservation or inquiry.

## Code Rules

- Keep code readable.
- Use clear file and component names.
- Separate UI, data, and business logic when reasonable.
- Avoid hardcoding the same text in many places.
- Make future automation easy to add.
- Add comments only where they help understanding.
- Do not create unnecessary complexity.

## Documentation Rules

Create and maintain documentation files as needed.

Recommended files:

- README.md
- docs/project-brief.md
- docs/requirements.md
- docs/workflow.md
- docs/feature-ideas.md
- docs/design-reference.md

Design reference is not included yet.
Do not decide the final design direction until design references are provided later.

## Current Priority

For now, exclude final design decisions.

Focus on:

- Project structure
- Requirements
- MVP feature planning
- Homepage content structure
- Reservation flow
- Admin/reservation management structure
- Automation-ready architecture