export default function About() {
  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">ABOUT</p>
        <h1>About StudySprint</h1>

        <p className="lede">
          StudySprint Planner is a lightweight academic task management
          application designed to help students organize their schoolwork,
          manage deadlines, and keep track of their academic workload.
        </p>
      </section>

      <div className="about-grid">
        <section className="card about-card">
          <p className="eyebrow">THE PROJECT</p>
          <h2>Plan smarter. Study better.</h2>
          <p>
            StudySprint provides students with a simple place to create,
            organize, and manage academic tasks. Each task can include a
            subject, description, due date, and priority to make important
            deadlines easier to identify.
          </p>
        </section>

        <section className="card about-card">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>Simple task management</h2>
          <p>
            Add your school tasks from the Tasks page and StudySprint keeps
            them stored so you can return to your planner and continue where
            you left off.
          </p>
        </section>
      </div>

      <section className="creator-card">
        <p className="eyebrow">CREATOR</p>
        <h2>Developed by Jeanne Clarisse Bermudo</h2>
        <p>
          StudySprint Planner was created as an academic project to provide
          students with a simple and organized way to manage their school
          tasks and deadlines.
        </p>
      </section>
    </main>
  )
}