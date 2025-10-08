import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Supabase OAuth callback handler
    return NextResponse.json({ message: 'OAuth callback' });
}
