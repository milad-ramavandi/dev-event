import FormEvent from "@/components/FormEvent";

const CreateEventPage = () => {
  return (
    <section className="w-full md:w-175 flex flex-col gap-6 mx-auto">
      <h1 className="font-semibold text-[40px] sm:text-5xl text-left md:text-center">Create an Event</h1>
      <FormEvent/>
    </section>
  );
};

export default CreateEventPage;
