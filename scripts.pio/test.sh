#!/bin/bash -e


# TODO: Use `sm` tool to check if dependencies have already been installed.
if [ ! -d "node_modules/mocha" ]; then
	echo "Installing dev dependencies"
	npm install
fi

npm test

echo '<wf name="result">{}</wf>'

exit 0;
