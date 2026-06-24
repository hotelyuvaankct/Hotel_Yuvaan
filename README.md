# Hotel Yuvaan

Welcome to the official repository of **Hotel Yuvaan**. 

## Project Overview

Hotel Yuvaan is a modern and user-friendly website designed to provide seamless booking experiences and showcase the amenities of the hotel.

## Features
 
- Online room booking system
- Photo gallery of the hotel
- Information about services and amenities
- Contact form for inquiries

## Technologies Used

- HTML5, CSS3, JavaScript
- Backend: [Specify your backend technology, e.g., Node.js, Django]
- Database: [Specify your database, e.g., MySQL, MongoDB]

## Deployment branches

| Branch    | Environment | API config   | Domain (Vercel)        |
|-----------|-------------|--------------|------------------------|
| `main`    | Production  | `.env.prod`  | `hotelyuvaan.com`      |
| `develop` | Development | `.env.dev`   | `dev.hotelyuvaan.com`  |

Push to `develop` for dev deployments. Merge `develop` → `main` when ready for production.

### Local scripts

| Environment | Env file     | Dev server        | Build              |
|-------------|--------------|-------------------|--------------------|
| Dev (remote)| `.env.dev`   | `npm run dev`     | `npm run build:dev`|
| Local       | `.env.localhost` | `npm run dev:local`| `npm run build:local`|
| Production  | `.env.prod`  | `npm run dev:prod`| `npm run build:prod`|

**Vercel setup:** In Project Settings → Domains, assign `dev.hotelyuvaan.com` to the `develop` branch. Keep `main` as the Production branch.

### Vercel settings

Set build commands in the **Vercel dashboard** per project (not in `vercel.json`):

| Project | Build Command override |
|---------|------------------------|
| Dev | `npm run build:dev` |
| Prod | `npm run build:prod` |

If the log still shows `build:prod` after saving, expand **Production Overrides** on the same page and set Build Command to `npm run build:dev` there too, then redeploy.

**Vercel env vars** (Project Settings → Environment Variables) for `/api/contact` and `/api/reviews`:

| Variable | Preview / develop | Production |
|----------|-------------------|------------|
| `BACKEND_API_URL` | `https://dev-api.hotelyuvaan.com` | `https://api.hotelyuvaan.com` |
| `API_VERSION_PATH` | `/api/v1.0.0` | `/api/v1.0.0` |

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/rajveer6000/Hotel_Yuvaan.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Hotel_Yuvaan
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the development server:
    ```bash
    npm run dev          # remote dev API (.env.dev)
    npm run dev:local    # local backend at localhost:8080 (.env.localhost)
    npm run dev:prod     # production API (.env.prod)
    ```
2. Open your browser and visit `http://localhost:5173`.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries, please contact [rajveerjdh2021@gmail.com].
