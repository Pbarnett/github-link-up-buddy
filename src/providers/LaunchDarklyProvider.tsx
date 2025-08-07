../lib/launchdarkly/server-client';

interface LaunchDarklyContextProps {
  flags: LDFlagSet;
  ldClient: LDClient | null;
}

const LaunchDarklyContext = createContext<LaunchDarklyContextProps | undefined>(
  undefined
);

export const LaunchDarklyProvider: React.FC = ({ children }) => {
  const [flags, setFlags] = useState<LDFlagSet>({});
  const [ldClient, setLDClient] = useState<LDClient | null>(null);

  useEffect(() => {
    const ldServerClient = getLaunchDarklyServerClient();
    const userContext = createSingleContext({
      kind: 'USER',
      key: 'user-key', // Replace with actual user key
    });

    ldServerClient.waitForInitialization().then(() => {
      const client = new LDClient();
      setLDClient(client);

      client.on('change', (updatedFlags: LDFlagSet) => {
        setFlags(updatedFlags);
      });
    });

    return () => {
      ldClient?.close();
    };
  }, []);

  return (
    <LaunchDarklyContext.Provider value={{ flags, ldClient }}>
      {children}
    </LaunchDarklyContext.Provider>
  );
};

export const useLaunchDarkly = () => {
  const context = useContext(LaunchDarklyContext);
  if (!context) {
    throw new Error(
      'useLaunchDarkly must be used within a LaunchDarklyProvider'
    );
  }
  return context;
};
