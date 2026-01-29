import * as S from "../styles";

export function ActionsBar(props: {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  hideBorderTop?: boolean;
}) {
  const {
    primaryLabel,
    onPrimary,
    primaryDisabled,
    secondaryLabel,
    onSecondary,
    hideBorderTop,
  } = props;

  return (
    <S.Actions
      style={
        hideBorderTop
          ? { borderTop: "none", paddingTop: 0, marginTop: 12 }
          : undefined
      }
    >
      {secondaryLabel && onSecondary ? (
        <S.SecondaryButton type="button" onClick={onSecondary}>
          {secondaryLabel}
        </S.SecondaryButton>
      ) : null}

      <S.PrimaryButton
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
      >
        {primaryLabel}
      </S.PrimaryButton>
    </S.Actions>
  );
}
