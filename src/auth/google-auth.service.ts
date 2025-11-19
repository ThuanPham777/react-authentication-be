import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
    private readonly client: OAuth2Client | null;
    private readonly clientId: string | null;

    constructor(private readonly config: ConfigService) {
        this.clientId = this.config.get<string>('GOOGLE_CLIENT_ID') ?? null;
        console.log("clientId", this.clientId);
        this.client = this.clientId ? new OAuth2Client(this.clientId) : null;
    }

    private ensureClient() {
        if (!this.client || !this.clientId) {
            throw new UnauthorizedException('Google Sign-In is not configured');
        }
    }

    async verifyCredential(credential: string): Promise<TokenPayload> {
        this.ensureClient();
        const ticket = await this.client!.verifyIdToken({
            idToken: credential,
            audience: this.clientId!,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
            throw new UnauthorizedException('Invalid Google credential');
        }
        return payload;
    }
}


