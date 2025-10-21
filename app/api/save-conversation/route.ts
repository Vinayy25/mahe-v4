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

    // Write the messages to the main file (overwrite)
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    // Now, move to old_convos with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const oldConvosDir = path.join(process.cwd(), 'public', 'conversations', 'old_convos');
    if (!fs.existsSync(oldConvosDir)) {
      fs.mkdirSync(oldConvosDir, { recursive: true });
    }
    const newFilePath = path.join(oldConvosDir, `conversation_${timestamp}.json`);
    fs.renameSync(filePath, newFilePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ success: false, error: 'Failed to save conversation' }, { status: 500 });
  }
}
