#!/bin/bash

# Fix for missing @angular/animations dependency
echo "Installing missing @angular/animations dependency..."

# Install or update @angular/animations
npm install @angular/animations@^19.2.0 --save

# Update import in app.config.ts to explicitly include animations
sed -i 's/import { provideAnimations } from '"'"'@angular/platform-browser/animations'"'"';/import { provideAnimations } from '"'"'@angular/animations'"'"';/g' src/app/app.config.ts

echo "Dependency fix completed."
