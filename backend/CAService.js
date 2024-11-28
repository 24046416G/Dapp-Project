class CAService {
    static async getPublicKey() {
        try {
            const response = await fetch('/api/CA/public-key');
            const data = await response.json();
            if (data.success) {
                return data.publicKey;
            }
            throw new Error('Failed to get CA public key');
        } catch (error) {
            console.error('Error fetching CA public key:', error);
            throw error;
        }
    }

    static async getCAInfo() {
        try {
            const response = await fetch('/api/CA/info');
            const data = await response.json();
            if (data.success) {
                return {
                    publicKey: data.publicKey,
                    algorithm: data.algorithm,
                    version: data.version,
                    issuer: data.issuer
                };
            }
            throw new Error('Failed to get CA info');
        } catch (error) {
            console.error('Error fetching CA info:', error);
            throw error;
        }
    }
}

export default CAService;