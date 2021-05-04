yarn storybook --ci --quiet &

yarn wait-on http://localhost:6006 && yarn visual

pkill -f storybook