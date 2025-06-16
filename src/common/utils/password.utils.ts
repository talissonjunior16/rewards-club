import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class Utils {

    /**
     * Gera um hash seguro da senha usando bcrypt.
     */
    static async hashPassword(plainPassword: string): Promise<string> {
        return bcrypt.hash(plainPassword, SALT_ROUNDS);
    }

    /**
     * Compara uma senha em texto plano com o hash.
     */
    static async comparePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

}