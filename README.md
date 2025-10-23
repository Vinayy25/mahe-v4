# MAHE DUBAI DEMO

![MAHE DUBAI DEMO Screenshot](./public/demo.png)

This is a demo application showcasing interactive avatars using HeyGen's Streaming Avatar SDK. It features voice and text chat capabilities with customizable avatars for various use cases like therapy, coaching, and more.

## Features

- Interactive avatar sessions with voice and text chat
- Customizable avatar selection (e.g., therapists, doctors, fitness coaches)
- Real-time streaming with HeyGen API
- Support for multiple languages via STT (Speech-to-Text)
- Modern UI built with Tailwind CSS and Radix UI components
- TypeScript for type safety

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Avatar SDK**: @heygen/streaming-avatar
- **AI Integration**: OpenAI
- **State Management**: React Hooks (ahooks)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mahe-v4
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add your API keys:

   ```env
   HEYGEN_API_KEY=your_heygen_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   BASE_API_URL=your_base_api_url_if_needed
   ```

   - Get your HeyGen API key from [HeyGen Settings](https://app.heygen.com/settings?from=&nav=Subscriptions%20%26%20API).
   - (Optional) Add your OpenAI API key for enhanced features.

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Starting a Session

1. Select an avatar from the configuration panel.
2. Choose between "Start Voice Chat" or "Start Text Chat".
3. Interact with the avatar using voice or text input.

### Customizing Avatars

- Default avatars include therapists, doctors, and coaches.
- You can use public avatars from [HeyGen Labs](https://labs.heygen.com/interactive-avatar).
- Create custom avatars at HeyGen Labs for personalized experiences.

## Project Structure

```text
mahe-v4/
├── app/
│   ├── api/
│   ├── lib/
│   └── page.tsx
├── components/
│   ├── AvatarConfig/
│   ├── AvatarSession/
│   └── logic/
├── public/
├── styles/
└── package.json
```

## Contributing

Feel free to play around with the existing code and leave feedback on the [HeyGen SDK Discussions](https://github.com/HeyGen-Official/StreamingAvatarSDK/discussions).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [HeyGen Interactive Avatar 101](https://help.heygen.com/en/articles/9182113-interactive-avatar-101-your-ultimate-guide)
- [HeyGen Streaming Avatar SDK](https://github.com/HeyGen-Official/StreamingAvatarSDK)

## License

This project is private and for demonstration purposes only.

Useful commands for managing your app:
# SSH into your server
ssh -i "mahe-server.pem" ubuntu@ec2-43-205-199-30.ap-south-1.compute.amazonaws.com

# Check app status
pm2 status

# View app logs
pm2 logs nextjs-app

# Restart the app
pm2 restart nextjs-app

# Stop the app
pm2 stop nextjs-app

# View NGINX logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log