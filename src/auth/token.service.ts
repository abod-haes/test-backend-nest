import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createHmac,
  timingSafeEqual,
} from 'crypto';
import { AuthUser } from './auth-user.interface';

interface TokenPayload extends AuthUser {
  exp: number;
}

@Injectable()
export class TokenService {
  private readonly secret =
    process.env.JWT_SECRET ?? 'training-jwt-secret';

  sign(payload: AuthUser) {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const body: TokenPayload = {
      ...payload,
      exp:
        Math.floor(Date.now() / 1000) +
        60 * 60 * 24,
    };

    const encodedHeader = this.encode(header);
    const encodedBody = this.encode(body);
    const unsignedToken =
      `${encodedHeader}.${encodedBody}`;

    const signature =
      this.createSignature(unsignedToken);

    return `${unsignedToken}.${signature}`;
  }

  verify(token: string): AuthUser {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new UnauthorizedException(
        'Invalid access token',
      );
    }

    const [
      encodedHeader,
      encodedBody,
      signature,
    ] = parts;

    const unsignedToken =
      `${encodedHeader}.${encodedBody}`;

    const expectedSignature =
      this.createSignature(unsignedToken);

    const signatureBuffer =
      Buffer.from(signature);

    const expectedBuffer =
      Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !==
      expectedBuffer.length
    ) {
      throw new UnauthorizedException(
        'Invalid access token',
      );
    }

    if (
      !timingSafeEqual(
        signatureBuffer,
        expectedBuffer,
      )
    ) {
      throw new UnauthorizedException(
        'Invalid access token',
      );
    }

    let payload: TokenPayload;

    try {
      payload = JSON.parse(
        Buffer.from(
          encodedBody,
          'base64url',
        ).toString('utf8'),
      ) as TokenPayload;
    } catch {
      throw new UnauthorizedException(
        'Invalid access token',
      );
    }

    if (
      !payload.exp ||
      payload.exp <
        Math.floor(Date.now() / 1000)
    ) {
      throw new UnauthorizedException(
        'Access token expired',
      );
    }

    const {
      exp: _exp,
      ...user
    } = payload;

    return user;
  }

  private encode(value: object) {
    return Buffer.from(
      JSON.stringify(value),
    ).toString('base64url');
  }

  private createSignature(
    value: string,
  ) {
    return createHmac(
      'sha256',
      this.secret,
    )
      .update(value)
      .digest('base64url');
  }
}
