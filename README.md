# MAHE DUBAI DEMO 

![MAHE Dubai Logo](./public/mahe_logo.jpeg)

A sophisticated interactive avatar platform built for MAHE Dubai, featuring AI-powered virtual assistants with voice and text chat capabilities. This application provides immersive conversations with specialized avatars including therapists, doctors, fitness coaches, and tech experts.

## 🌟 Features

### Core Functionality
- **Interactive Avatar Sessions**: Real-time voice and text chat with AI avatars
- **Multi-Avatar Support**: Therapists, doctors, fitness coaches, and tech experts
- **Voice Chat**: Advanced speech-to-text and text-to-speech capabilities
- **Text Chat**: Traditional messaging interface with rich interactions
- **Real-time Streaming**: Powered by HeyGen's advanced streaming technology

### User Experience
- **Fully Responsive Design**: Optimized for mobile, tablet, desktop, and large screens
- **Modern Glassmorphic UI**: Beautiful, modern interface with backdrop blur effects
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Multi-language Support**: 28+ languages supported via advanced STT
- **Accessibility**: Built with accessibility best practices

### Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **Real-time Communication**: WebSocket-based streaming for low latency
- **Customizable Configuration**: Extensive avatar and voice customization options
- **Production Ready**: Optimized for deployment and scalability

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom responsive breakpoints
- **UI Components**: Radix UI primitives
- **Avatar SDK**: @heygen/streaming-avatar
- **Animations**: Framer Motion
- **State Management**: React Hooks with ahooks utilities
- **Package Manager**: npm/pnpm/yarn

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **Package Manager**: npm, pnpm, or yarn
- **HeyGen API Key**: Required for avatar functionality

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mahe-v4
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Configuration**:
   
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Required - HeyGen API Configuration
   HEYGEN_API_KEY=your_heygen_api_key_here
   BASE_API_URL=https://api.heygen.com
   
   # Avatar Configuration
   KNOWLEDGEBASE_ID=your_knowledge_base_id
   NEXT_PUBLIC_DEFAULT_AVATAR_NAME=Ann_Therapist_public
   
   # Voice & Audio Settings
   NEXT_PUBLIC_AVATAR_QUALITY=medium
   NEXT_PUBLIC_VOICE_RATE=1.5
   NEXT_PUBLIC_VOICE_EMOTION=EXCITED
   NEXT_PUBLIC_VOICE_MODEL=eleven_flash_v2_5
   NEXT_PUBLIC_LANGUAGE=en
   
   # Communication Settings
   NEXT_PUBLIC_VOICE_CHAT_TRANSPORT=WEBSOCKET
   NEXT_PUBLIC_STT_PROVIDER=DEEPGRAM
   ```

   **Getting API Keys**:
   - **HeyGen API Key**: Get from [HeyGen Settings](https://app.heygen.com/settings?from=&nav=Subscriptions%20%26%20API)
   - **Knowledge Base ID**: Create at [HeyGen Knowledge Base](https://app.heygen.com/knowledge-base)

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage Guide

### Starting Your First Session

1. **Launch the Application**: Open the platform in your web browser
2. **Choose Interaction Mode**: 
   - 🎤 **Voice Chat**: Natural speech conversation with the avatar
   - 💬 **Text Chat**: Traditional text-based messaging
3. **Select Your Avatar**: Choose from available specialists:
   - **Ann Therapist**: Mental health and wellness support
   - **Shawn Therapist**: Alternative therapy approach
   - **Bryan Fitness Coach**: Health and fitness guidance
   - **Dexter Doctor**: Medical consultation and advice
   - **Elenora Tech Expert**: Technology and IT support

### Avatar Interaction Features

- **Real-time Responses**: Instant avatar reactions and responses
- **Voice Recognition**: Advanced speech-to-text in 28+ languages
- **Interrupt Capability**: Stop avatar mid-sentence for natural conversation flow
- **Fullscreen Mode**: Immersive experience for focused sessions
- **Session Management**: Easy start/stop controls

### Responsive Design

The platform automatically adapts to your device:
- **📱 Mobile**: Touch-optimized interface with gesture support
- **📱 Tablet**: Enhanced layout with larger interaction areas
- **💻 Desktop**: Full-featured experience with keyboard shortcuts
- **📺 Large Screens**: Optimized for presentations and public displays

## 🚀 Deployment

### Production Build

1. **Build the application**:
   ```bash
   npm run build
   # or
   pnpm build
   ```

2. **Start production server**:
   ```bash
   npm start
   # or
   pnpm start
   ```

### Environment Setup for Production

Ensure all environment variables are properly configured in your production environment:

```env
# Production Environment Variables
HEYGEN_API_KEY=your_production_heygen_key
BASE_API_URL=https://api.heygen.com
KNOWLEDGEBASE_ID=your_production_knowledge_base
# ... other variables as needed
```

### Deployment Platforms

This application can be deployed on:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**
- **Traditional hosting with Node.js support**

## 🏗 Project Structure

```
mahe-v4/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── get-access-token/     # HeyGen token management
│   ├── lib/                      # Shared utilities
│   │   └── constants.ts          # Avatar and language configurations
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main application page
├── components/                   # React components
│   ├── AvatarConfig/            # Avatar configuration components
│   ├── AvatarSession/           # Session management components
│   │   ├── AudioInput.tsx       # Voice input handling
│   │   ├── AvatarControls.tsx   # Session controls
│   │   ├── AvatarVideo.tsx      # Video display component
│   │   └── TextInput.tsx        # Text input handling
│   ├── logic/                   # Custom hooks and state management
│   │   ├── useStreamingAvatarSession.ts
│   │   ├── useVoiceChat.ts
│   │   └── useTextChat.ts
│   ├── ui/                      # Reusable UI components
│   └── InteractiveAvatar.tsx    # Main avatar component
├── public/                      # Static assets
│   ├── mahe_logo.jpeg          # MAHE Dubai branding
│   └── arun.jpeg               # Additional assets
├── styles/                      # Global styles
│   ├── globals.css             # Tailwind and custom styles
│   └── scrollbar.css           # Custom scrollbar styling
└── package.json                # Dependencies and scripts
```

## 🔧 Configuration Options

### Avatar Quality Settings
- `low`: Optimized for slower connections
- `medium`: Balanced quality and performance (recommended)
- `high`: Maximum quality for high-speed connections

### Voice Configuration
- **Rate**: Speech speed (0.5 - 2.0)
- **Emotion**: EXCITED, CALM, SERIOUS, FRIENDLY
- **Model**: ElevenLabs voice models for natural speech

### Language Support
The platform supports 28+ languages including:
- English, Spanish, French, German
- Chinese, Japanese, Korean
- Arabic, Hindi, Portuguese
- And many more...

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Development Guidelines

- **Code Style**: Follow TypeScript and React best practices
- **Components**: Use functional components with hooks
- **Styling**: Utilize Tailwind CSS utility classes
- **State Management**: Leverage React hooks and context
- **Testing**: Ensure responsive design across all breakpoints

## 📞 Support & Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [HeyGen Interactive Avatar Guide](https://help.heygen.com/en/articles/9182113-interactive-avatar-101-your-ultimate-guide)
- [HeyGen Streaming Avatar SDK](https://github.com/HeyGen-Official/StreamingAvatarSDK)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Getting Help
- **HeyGen Support**: [HeyGen SDK Discussions](https://github.com/HeyGen-Official/StreamingAvatarSDK/discussions)
- **Technical Issues**: Check the GitHub repository for known issues
- **Feature Requests**: Submit via the project's issue tracker

## 📄 License

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