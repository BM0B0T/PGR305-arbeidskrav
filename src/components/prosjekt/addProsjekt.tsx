import React, { useContext, useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { kundeContext } from '../../context/kundeContext';
import { prosjektContext } from '../../context/prosjektContext';
import { kunde } from '../../interfaces/kunde';
import { Status } from '../../interfaces/status';
import { KundeContextType } from '../../types/kundeContextType';
import { ProsjektContextType } from '../../types/prosjektContextType';
import { InputField } from '../common/inputField';
import { InputSelect } from '../common/inputSelect';

export const AddProsjekt = () => {
  const { kunder } = useContext(kundeContext) as KundeContextType;
  const { prosjekter, saveProsjekt } = useContext(
    prosjektContext
  ) as ProsjektContextType;
  const [navn, setNavn] = useState('');
  const [kunde, setKunde] = useState<kunde | null>(null);
  const [status, setStatus] = useState(Status.PLANING);
  const [error, setError] = useState<string>();

  const resetState = () => {
    setNavn('');
    setKunde(null);
    setStatus(Status.PLANING);
  };

  const validate = () => {
    if (navn.length <= 3) {
      setError('navn må fylles ut');
      return false;
    }
    if (kunde == null) {
      setError('kunde må være valgt');
      return false;
    }
    return true;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    if (kunde == null) validate();
    else if (
      validate() &&
      saveProsjekt({
        Id: prosjekter.length + 1,
        navn,
        kunde,
        status,
        ansatte: [],
      })
    )
      resetState();
  };

  return (
    <Container>
      <h1>Legg til prosjekt</h1>
      <Form onSubmit={submit}>
        {error && <Alert variant={'danger'}>{error}</Alert>}

        <InputField
          value={navn}
          onValueChange={setNavn}
          required={true}
          label={'navn'}
        />

        <InputSelect
          value={status}
          onValueChange={(e) => setStatus(e.target.value)}
          label={'status'}
        >
          <option value={Status.PLANING}>Planing</option>
          <option value={Status.ONGOING}>Ongoing</option>
          <option value={Status.COMPLETED}>Completed</option>
        </InputSelect>

        <InputSelect
          value={kunde ? JSON.stringify(kunde) : ''}
          onValueChange={(e) =>
            setKunde(
              kunder.find((k: kunde) => JSON.stringify(k) === e.target.value) ||
                null
            )
          }
          label={'kunde'}
        >
          <option value="">velg en kunde</option>
          {kunder.map((kunde: kunde, i) => (
            <option key={i} value={JSON.stringify(kunde)}>
              {kunde.navn}
            </option>
          ))}
        </InputSelect>

        <br />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <br />
    </Container>
  );
};
