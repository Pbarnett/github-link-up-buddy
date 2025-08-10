import React, { useState } from "react";

export type WalletNicknameProps = {
  paymentMethod: {
    id: string;
    last4: string;
    brand: string;
    nickname?: string | null;
    isDefault?: boolean;
  };
  onUpdateNickname: (id: string, nickname: string) => Promise<void> | void;
  onSetDefault?: (id: string) => Promise<void> | void;
};

export const WalletNickname: React.FC<WalletNicknameProps> = ({
  paymentMethod,
  onUpdateNickname,
  onSetDefault,
}) => {
  const [nickname, setNickname] = useState<string>(paymentMethod.nickname || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdateNickname(paymentMethod.id, nickname.trim());
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async () => {
    if (!onSetDefault) return;
    await onSetDefault(paymentMethod.id);
  };

  return (
    <div className="p-4 border rounded-lg space-y-3" data-testid={`wallet-nickname-${paymentMethod.id}`}>
      <div className="text-sm text-muted-foreground">
        {paymentMethod.brand} •••• {paymentMethod.last4}
      </div>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="Add a nickname (e.g., Personal Visa)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          aria-label="Payment method nickname"
        />
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
          aria-busy={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {onSetDefault && (
        <button
          className="px-3 py-1 rounded bg-gray-100 border"
          onClick={handleSetDefault}
          disabled={paymentMethod.isDefault}
          aria-disabled={paymentMethod.isDefault}
        >
          {paymentMethod.isDefault ? "Default" : "Set as default"}
        </button>
      )}
    </div>
  );
};

