# project232 Turn-Based Combat Game POC

A proof-of-concept project demonstrating core gameplay mechanics, user interface, and overall user experience for a turn-based combat game built with React.

## Project Overview

This project serves as a technical demonstration of a turn-based combat system, featuring strategic gameplay elements, team management, and status effects.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Git

### Dependencies

The project uses the following dependencies:
- React 19.0.0
- React DOM 19.0.0
- React Router 7.3.0
- Testing libraries (Jest, React Testing Library)

### Installation

1. Clone the repository
```bash
git clone https://your-repository-url/TurnBasedPOC.git
```
2. Navigate to the project directory
```bash
cd TurnBasedPOC
```
3. Install dependencies:
```bash
npm install
```

### Git Operations

#### Pulling Changes

To update your local repository with the latest changes from the remote repository:

1. Fetch the latest changes without merging:
```bash
git fetch
```

2. Check what changes are available:
```bash
git status
```

3. Pull and merge changes into your current branch:
```bash
git pull
```

4. If you have local changes that you want to preserve when pulling:
   
   a. Stash your changes first:
   ```bash
   git stash
   ```
   
   b. Pull the latest changes:
   ```bash
   git pull
   ```
   
   c. Apply your stashed changes:
   ```bash
   git stash pop
   ```
   
   d. Resolve any merge conflicts if they occur

5. After pulling new changes, you may need to install new dependencies:
```bash
npm install
```

### Running the Project

Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Game Mechanics

### Combat Overview

- Battles are fought between two sides:
  - Player's team (6 units)
  - Pre-set enemy encounter
- Combat occurs in turns
- Player always goes first but is limited to 1 action on their first turn
- Goal: Defeat all enemies before your team is eliminated
- Units take actions one at a time
- New round begins after all units have acted/passed

### Available Actions

Each unit can take one of the following actions per turn:

1. **Basic Attack**
   - Standard attack dealing damage based on unit stats

2. **Special Ability**
   - Unique skills with various effects
   - Uses cooldown system
   - May deal more damage, apply status effects, or support allies
   - Examples include:
     - Blizzard: Area of effect damage with chance to freeze enemies
     - Iron Wall Assault: Damage and stun a target enemy
     - Triage Tactics: Heal allies and remove negative status effects
     - Sanguine Pact: Sacrifice HP to empower an ally's damage

3. **Combo Attacks**
   - Special attacks combining multiple units
   - Must use units in sequence/together

4. **Pass**
   - Skip turn/Do nothing

### Status Effects

Various abilities can apply status effects that persist for multiple turns:

- **Burn**: Damage over time (2 damage per turn)
- **Poison**: Health loss each turn (1 damage per turn)
- **Stun/Frozen**: Skip next turn
- **Confused**: Attack random targets (can hit allies)
- **Shield**: Temporary damage protection
- **Damage Boost**: Increased attack power for a limited time

### Combat Features

- **Taunt**: Units with taunt must be targeted first
- **Lifesteal**: Units heal for damage dealt
- **Pack Hunter**: Some units gain bonuses when fighting together
- **Retaliation**: Optional setting for units to counter-attack when hit

### Campaign Mode

- Progress through a series of battles with persistent unit health
- Different battlegrounds with unique enemy teams
- Unit damage and death persists between battles

### Victory Conditions

- **Win**: Defeat all enemy units
- **Lose**: All player units are defeated

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
