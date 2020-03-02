## Math Smash: Animal Rescue

To build just run:

```
npm install
npm run build
```

This will create a bundle.js file in the `public/` directory. Running `npm start` will start the test server on port 3000 for testing the game locally. Otherwise to deploy just host the contents of the public directory somewhere. The resources needed for the game are in the `res/` subdirectory which is referenced relative to the game's HTML page. If you need to change the API key, pool key, or resource base URL, there's a block of constants in `src/index.ts` where these things are defined. Make the change there and rebuild the bundle.
