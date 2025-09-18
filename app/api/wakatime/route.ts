import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Wakatime API key (public readonly key)
    const apiKey = process.env.WAKATIME_API;

    // Get summary data for the last 30 days
    const url = `https://wakatime.com/api/v1/users/current/summaries?api_key=${apiKey}&range=last_30_days`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Wakatime API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // You can process or filter the data here if needed
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch Wakatime data' },
      { status: 500 }
    );
  }
}