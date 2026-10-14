# Infisical Environment Setup

We use **Infisical** to load environment variables into the server application.

## Setup Steps

### 1. Navigate to the Server Directory

```bash
cd server
```

### 2. Install the Infisical CLI

Install the Infisical CLI globally:

```bash
npm install -g @infisical/cli
```

### 3. Verify the Installation

Check whether the CLI is installed successfully:

```bash
infisical --version
```

### 4. Initialize Infisical

Run the following command inside the `server` directory:

```bash
infisical init
```

Follow the prompts:

1. Select the **US region**.
2. Open the callback URL displayed in the terminal.
3. Authorize the device in your browser.
4. Select the appropriate Infisical project.

### 5. Start the Development Server

Once Infisical is configured, start the application:

```bash
npm run start:dev-i
```

The application will use Infisical to load the configured environment variables when starting the server.

## Notes

- Run the setup commands from the `server` directory where applicable.
- Ensure you have access to the correct Infisical project.
- If authentication expires or initialization fails, authenticate again and verify your project configuration.
