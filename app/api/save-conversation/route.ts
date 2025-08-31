import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const filePath = path.join(process.cwd(), 'public', 'conversations', 'conversation.json');

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Read existing conversation or initialize empty array
    let existingMessages = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      existingMessages = JSON.parse(data);
    }

    // Append new messages from the session
    existingMessages.push(...messages);

    // Write back the updated conversation
    fs.writeFileSync(filePath, JSON.stringify(existingMessages, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ success: false, error: 'Failed to save conversation' }, { status: 500 });
  }
}
